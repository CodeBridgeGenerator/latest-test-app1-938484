import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationsPage from "../ApplicationsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders applications page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("applications-datatable")).toBeInTheDocument();
    expect(screen.getByRole("applications-add-button")).toBeInTheDocument();
});
