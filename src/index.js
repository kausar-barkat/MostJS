// @flow
import React from "react";
import * as ReactDOM from "react-dom";
import { createAdapter } from "@most/adapter";
import { map, runEffects, tap, merge, skipRepeats, scan } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";
import { emptyApp } from "./model";
import { View } from "./view";
import { handleFilterChange, runAction } from "./action";
import { hashchange } from "@most/dom-event";

const fail = (s) => {
  throw new Error(s);
};
const qs = (s: string, el: Document): Element =>
  el.querySelector(s) || fail(`${s} not found`);

const appNode = qs(".todoapp", document);
const appState = emptyApp;
const scheduler = newDefaultScheduler();

const [addAction, todoActions] = createAdapter();

const updateFilter = map(handleFilterChange, hashchange(window));

const actions = merge(todoActions, updateFilter);

const stateUpdates = skipRepeats(scan(runAction, appState, actions));

const viewUpdates = tap(
  (rel) => ReactDOM.render(rel, appNode),
  map(View(addAction), stateUpdates)
);

console.log(runEffects(viewUpdates, scheduler));
