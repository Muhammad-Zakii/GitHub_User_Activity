import axios from "axios";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

async function fetchGitHubActivity(username) {
  const url = `https://api.github.com/users/${username}/events`;

  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    process.exit(1);
  }
}

function displayActivity(events) {
  if (events?.length === 0) {
    console.log(chalk.yellow("No recent activity found."));
    return;
  }

  events.forEach((event) => {
    console.log(`${chalk.green(event.type)} at ${chalk.blue(event.repo.name)}`);
    console.log(`- ${new Date(event.created_at).toLocaleString()}`);
    console.log("");
  });
}

program
  .version("1.0.0")
  .description("CLI to fetch recent GitHub activity of a user")
  .argument("<username>", "GitHub username")
  .action(async (username) => {
    const events = await fetchGitHubActivity(username);
    displayActivity(events);
  });

program.parse(process.argv);
