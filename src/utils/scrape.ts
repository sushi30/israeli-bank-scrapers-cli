import { createScraper, CompanyTypes } from "israeli-bank-scrapers";
import { Command } from "commander";
import { TransactionsAccount } from "israeli-bank-scrapers/lib/transactions";
import moment from "moment";
import * as json2csv from "json2csv";
import * as fs from "fs/promises";

export function addScrapeOptions(command: Command) {
	command
		.requiredOption("--output <output>")
		.requiredOption("--company-id <company-id>")
		.option("--verbose")
		.requiredOption("--start-date <start-date>")
		.option("--show-browser")
		.option("--browser <browser>")
		.option("--executable-path <executable-path>")
		.option("--combine-installments")
		.option("--args <args>")
		.option(
			"--store-failure-screen-shot-path <store-failure-screen-shot-path>"
		);
	return command;
}

export function exportTransactions(
	path: string,
	accounts: TransactionsAccount[]
) {
	let data: any = [];

	for (let i = 0; i < accounts.length; i += 1) {
		const account = accounts[i];

		data = [
			...data,
			...account.txns.map((txn) => {
				return {
					account: account.accountNumber,
					balance: account.balance,
					...txn,
					date: moment(txn.date).format("DD/MM/YYYY"),
					processedDate: moment(txn.processedDate).format("DD/MM/YYYY"),
				};
			}),
		];
	}

	if (data.length === 0) {
		data = [
			{
				comment: "no transaction found for requested time frame",
			},
		];
	}

	const csv = json2csv.parse(data, { withBOM: true });
	return fs.writeFile(path, csv);
}

function getCredentials(companyId: CompanyTypes): Record<string, string> {
	const res: Record<string, string> = {};
	for (let key of Object.keys(process.env)) {
		const parts = key.split("_");
		if (
			parts[0] === "IBS" &&
			parts[1]?.toLowerCase() === companyId.toLowerCase()
		) {
			const recordKey = key
				.replace("IBS_", "")
				.replace(`${parts[1]}_`, "")
				.toLowerCase()
				.replace("digits", "Digits");
			recordKey && (res[recordKey] = process.env[key] as string);
		}
	}
	return res;
}

export async function scrape(options: any) {
	const scraper = createScraper(options);
	const credenetials = getCredentials(options.companyId);
	if (Object.keys(credenetials).length < 2) {
		throw Error("No credentials found");
	}
	const scrapeResult = await scraper.scrape(credenetials);
	if (scrapeResult.accounts) {
		await exportTransactions(options.output, scrapeResult.accounts);
	} else {
		throw Error(`${scrapeResult.errorType}: ${scrapeResult.errorMessage}`);
	}
}
