#!/usr/bin/env node
const cliPkg = require("../package");
const commander = require("commander");
const color = require("colorette");

function exit(text) {
	if (text instanceof Error) {
		if (text.message) {
			console.error(color.red(text.message));
		}
		console.error(
			color.red(`${text.detail ? `${text.detail}\n` : ""}${text.stack}`)
		);
	} else {
		console.error(color.red(text));
	}
	process.exit(1);
}

function success(text) {
	console.log(text);
	process.exit(0);
}

async function scrape(opts) {}

function invoke() {
	let modulePackage = {};
	try {
		modulePackage = require(path.join(
			path.dirname(env.modulePath),
			"package.json"
		));
	} catch (e) {}

	const cliVersion = [
		color.blue("Knex CLI version:"),
		color.green(cliPkg.version),
	].join(" ");

	const localVersion = [
		color.blue("Knex Local version:"),
		color.green(modulePackage.version || "None"),
	].join(" ");

	commander
		.command("scrape")
		.description("Scrape transactions.")
		.option("--verbose", "verbose")
		.option("--specific", "run specific seed file")
		.action(() => {
			scrape(commander.opts())
				.then(() => {
					success(color.green(`Scraped succesfully`));
				})
				.catch(exit);
		});

	commander.parse(process.argv);
}

invoke();
