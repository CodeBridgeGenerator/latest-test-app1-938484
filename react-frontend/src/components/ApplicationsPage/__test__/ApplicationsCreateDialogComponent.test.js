import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationsCreateDialogComponent from "../ApplicationsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders applications create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("applications-create-dialog-component")).toBeInTheDocument();
});
