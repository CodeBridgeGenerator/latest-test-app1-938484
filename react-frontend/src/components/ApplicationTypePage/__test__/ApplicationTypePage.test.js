import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationTypePage from "../ApplicationTypePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders applicationType page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationTypePage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("applicationType-datatable")).toBeInTheDocument();
    expect(screen.getByRole("applicationType-add-button")).toBeInTheDocument();
});
