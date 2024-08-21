import React from "react";
import { render, screen } from "@testing-library/react";

import MyTemplatesPage from "../MyTemplatesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders myTemplates page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MyTemplatesPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("myTemplates-datatable")).toBeInTheDocument();
    expect(screen.getByRole("myTemplates-add-button")).toBeInTheDocument();
});
