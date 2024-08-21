import React from "react";
import { render, screen } from "@testing-library/react";

import MyTemplatesEditDialogComponent from "../MyTemplatesEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders myTemplates edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MyTemplatesEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("myTemplates-edit-dialog-component")).toBeInTheDocument();
});
