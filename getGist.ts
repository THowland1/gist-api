import { Octokit } from '@octokit/core';
import {
  restEndpointMethods,
  RestEndpointMethodTypes,
} from '@octokit/plugin-rest-endpoint-methods';

type Gist = Pick<
  RestEndpointMethodTypes['gists']['get']['response']['data'],
  'files'
>;

type RateLimit =
  RestEndpointMethodTypes['rateLimit']['get']['response']['data'];

const MyOctokit = Octokit.plugin(restEndpointMethods);
const octokit = new MyOctokit();
type Sync<T> = T extends Promise<infer R> ? R : never;
type Response =
  | {
      success: false;
    }
  | {
      success: true;
      gist: Gist;
    };

export default async function getGist(
  gistId: string,
  auth: string
): Promise<Response> {
  try {
    const octokit = new MyOctokit({
      auth,
    });
    const gist = await octokit.rest.gists.get({
      gist_id: gistId,
    });
    gist;
    return { success: true, gist: gist.data };
  } catch (error) {
    return { success: false };
  }
}

type RateLimitResponse =
  | {
      success: false;
    }
  | {
      success: true;
      rateLimit: RateLimit;
    };

export async function getRateLimit(auth: string): Promise<RateLimitResponse> {
  try {
    const octokit = new MyOctokit({
      auth,
    });
    const rateLimit = await octokit.rest.rateLimit.get({});

    return { success: true, rateLimit: rateLimit.data };
  } catch (error) {
    return { success: false };
  }
}
