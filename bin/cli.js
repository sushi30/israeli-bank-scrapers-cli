#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createCommand = require("commander").createCommand;
var colorette_1 = __importDefault(require("colorette"));
var scrape_1 = require("./utils/scrape");
var command = createCommand();
function exit(text) {
    if (text instanceof Error) {
        if (text.message) {
            console.error(colorette_1.default.red(text.message));
        }
        console.error(colorette_1.default.red("" + (text.name ? text.message + "\n" : "") + text.stack));
    }
    else {
        console.error(colorette_1.default.red(text));
    }
    process.exit(1);
}
function success(text) {
    console.log(text);
    process.exit(0);
}
function invoke() {
    var modulePackage = {};
    var cliVersion = [
        colorette_1.default.blue("Knex CLI version:"),
        colorette_1.default.green("0"),
    ].join(" ");
    var localVersion = [
        colorette_1.default.blue("Knex Local version:"),
        colorette_1.default.green(modulePackage.version || "None"),
    ].join(" ");
    command
        .command("scrape")
        .description("Scrape transactions.")
        .option("--verbose", "verbose")
        .option("--specific", "run specific seed file")
        .action(function () {
        (0, scrape_1.scrape)(command.opts())
            .then(function () {
            success(colorette_1.default.green("Scraped succesfully"));
        })
            .catch(exit);
    });
    command.parse(process.argv);
}
invoke();
