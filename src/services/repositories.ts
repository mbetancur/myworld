const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;

const PROJECT_TOPIC = 'my-world-app';
export interface Repository {
  created_at: string;
  description: string;
  homepage: string;
  html_url: string;
  id: number;
  name: string;
  project_id: string;
  topics: string[];
}

export async function fetchRepositories(): Promise<Repository[]> {
  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    console.error('Error: GITHUB_TOKEN and GITHUB_USERNAME must be set in .env file');
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json() as Repository[];
    const filteredRepos = repos
      .filter(repo => repo.topics.includes(PROJECT_TOPIC))
      .map((repo, index) => ({
        created_at: repo.created_at,
        description: repo.description,
        homepage: repo.homepage,
        html_url: repo.html_url,
        id: repo.id,
        name: repo.name,
        project_id: `project-${index + 1}`,
        topics: repo.topics,
      } satisfies Repository));

    return filteredRepos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}
