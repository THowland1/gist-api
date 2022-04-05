import { Handler } from '@netlify/functions';
import getGist, { getRateLimit } from '../../getGist';

type QueryParams = Partial<{
  skip: number;
  top: number;
  sortby: string;
  sortdirection: 'asc' | 'desc';
}>;

function asStringOrUndefined(value: string | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
function asAscOrDescOrUndefined(
  value: string | undefined
): 'asc' | 'desc' | undefined {
  return typeof value === 'string' && (value === 'asc' || value === 'desc')
    ? value
    : undefined;
}
function asNumberOrUndefined(value: string | undefined): number | undefined {
  return typeof value === 'string' && !isNaN(Number(value))
    ? Number(value)
    : undefined;
}

function parseQueryParams(
  queryStringParameters: Record<string, string | undefined>
): QueryParams {
  return {
    skip: asNumberOrUndefined(queryStringParameters.skip),
    top: asNumberOrUndefined(queryStringParameters.top),
    sortby: asStringOrUndefined(queryStringParameters.sortby),
    sortdirection: asAscOrDescOrUndefined(queryStringParameters.sortdirection),
  };
}

function parseAttempt(text: any) {
  try {
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    return { success: false };
  }
}

export const handler: Handler = async (event, context) => {
  const queryParams = parseQueryParams(event.queryStringParameters);

  const accessToken =
    event.headers.authorization?.split('Bearer ')?.[1] ??
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  const gistAttempt = await getGist(event.path.split('/')[2], accessToken);
  const rateLimitAttempt = await getRateLimit(accessToken);
  if (!gistAttempt.success || !rateLimitAttempt.success) {
    return {
      statusCode: 400,
      body: 'GIST_NOT_FOUND',
    };
  }
  const gist = gistAttempt.gist;
  const rateLimit = rateLimitAttempt.rateLimit;

  const gistFiles = gist.files;
  const gistFileKeys = Object.keys(gistFiles);
  if (gistFileKeys.length === 0) {
    return {
      statusCode: 400,
      body: 'GIST_HAS_NO_FILES',
    };
  }
  const contentString = gistFiles[gistFileKeys[0]].content;
  const contentAttempt = parseAttempt(contentString);
  if (!contentAttempt.success) {
    return {
      statusCode: 400,
      body: 'GIST_IS_NOT_JSON',
    };
  }
  let content = JSON.parse(contentString);
  if (!Array.isArray(content)) {
    return {
      statusCode: 400,
      body: 'GIST_IS_NOT_AN_ARRAY',
    };
  }
  const totalCount = content.length;
  const { sortby, sortdirection } = queryParams;
  if (sortby) {
    const first = content[0];
    if (typeof first === 'object' && (first as object).hasOwnProperty(sortby)) {
      content.sort((a, b) =>
        a[sortby] > b[sortby] ? 1 : b[sortby] > a[sortby] ? -1 : 0
      );
      if (sortdirection && sortdirection === 'desc') {
        content.reverse();
      }
    }
  }
  const { skip, top } = queryParams;
  content = content.slice(skip ?? 0, top ? (skip ?? 0) + top : undefined);

  return {
    statusCode: 200,
    body: JSON.stringify(
      { url: event.rawUrl, totalCount, data: content },
      null,
      2
    ),
    headers: {
      'access-control-allow-origin': '*',
    },
  };
};
