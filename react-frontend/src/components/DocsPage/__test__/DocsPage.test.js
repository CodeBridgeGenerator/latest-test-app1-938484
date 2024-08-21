import React from "react";
import { render, screen } from "@testing-library/react";

import DocsPage from "../DocsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders docs page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <DocsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("docs-datatable")).toBeInTheDocument();
    expect(screen.getByRole("docs-add-button")).toBeInTheDocument();
});
