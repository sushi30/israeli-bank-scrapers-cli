#!/usr/bin/env node
const { createCommand } = require("commander");
import { createColors } from "colorette";
import { scrape } from "./utils/scrape";

const color = createColors();
const command = createCommand();

function exit(text: any) {
	if (text instanceof Error) {
		if (text.message) {
			console.error(color.red(text.message));
		}
		console.error(
			color.red(`${text.name ? `${text.message}\n` : ""}${text.stack}`)
		);
	} else {
		console.error(color.red(text));
	}
	process.exit(1);
}

function success(text: string) {
	console.log(text);
	process.exit(0);
}

function invoke() {
	let modulePackage: any = {};

	const cliVersion = [color.blue("Knex CLI version:"), color.green("0")].join(
		" "
	);

	const localVersion = [
		color.blue("Knex Local version:"),
		color.green(modulePackage.version || "None"),
	].join(" ");

	command
		.command("scrape")
		.description("Scrape transactions.")
		.option("--verbose", "verbose")
		.option("--specific", "run specific seed file")
		.action(() => {
			scrape(command.opts())
				.then(() => {
					success(color.green(`Scraped succesfully`));
				})
				.catch(exit);
		});

	command.parse(process.argv);
}

invoke();
