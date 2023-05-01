import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

function kBtoMB(kb) {
  console.log(kb);
  if (kb < 1024 * 100) {
    return `${(kb / 1024).toFixed(2)} kB`;
  }
  return `${(kb / 1024 / 1024).toFixed(2)} MB`;
}

function generateSchema(kb) {
  return {
    schemaVersion: 1,
    label: "dependency size",
    message: kBtoMB(kb),
    color: "blue",
  };
}

export async function getRepoSize(user, repo) {
  let response;
  try {
    response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/package.json",
      {
        owner: user,
        repo: repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  } catch (e) {
    return { error: "Repository not found.", status: 404 };
  }

  if (response.data.size > 1024 * 10) {
    return { error: "File too large.", status: 413 };
  }

  let package_json = atob(response.data.content).replace(/\s/gm, "");
  package_json = package_json.replace(/.*"dependencies":{/gm, "").slice(0, -2);

  let packages = package_json
    .split(",")
    .map((item) => item.split(":")[0].replace(/"/g, ""));

  if (packages.length >= 50) {
    return { error: "Too many dependencies.", status: 413 };
  }

  const data = await Promise.all(
    packages.map((name) =>
      fetch(`https://bundlephobia.com/api/size?package=${name}`).then((resp) =>
        resp.json()
      )
    )
  );

  let gzipped_list = data.map((item) => item.gzip);
  let total_size = gzipped_list.reduce((a, b) => a + b, 0);
  let schema = generateSchema(total_size);
  return JSON.stringify(schema);
}
