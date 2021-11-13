#!/usr/bin/env node
import { createCommand } from "commander";
import { createColors } from "colorette";
import { addScrapeOptions, scrape } from "./utils/scrape";
import path from "path";
import fs from "fs";

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
	try {
		const packageJSONPath = path.resolve(__dirname, "../package.json");
		modulePackage = JSON.parse(fs.readFileSync(packageJSONPath).toString());
	} catch (e) {}
	const cliVersion = [color.blue("Knex CLI version:"), color.green("0")].join(
		" "
	);

	const localVersion = [
		color.blue("Knex Local version:"),
		color.green(modulePackage.version || "None"),
	].join(" ");
	addScrapeOptions(
		command
			.version(`${cliVersion}\n${localVersion}`)
			.command("scrape")
			.description("Scrape transactions.")
	).action((options) => {
		scrape(options)
			.then(() => {
				success(color.green(`Scraped succesfully`));
			})
			.catch(exit);
	});

	command.parse(process.argv);
}

invoke();
