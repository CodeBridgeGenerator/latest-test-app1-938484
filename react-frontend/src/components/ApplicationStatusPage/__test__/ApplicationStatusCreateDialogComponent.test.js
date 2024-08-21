import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationStatusCreateDialogComponent from "../ApplicationStatusCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders applicationStatus create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationStatusCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("applicationStatus-create-dialog-component")).toBeInTheDocument();
});
