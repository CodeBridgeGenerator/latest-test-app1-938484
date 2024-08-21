import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationStatusEditDialogComponent from "../ApplicationStatusEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders applicationStatus edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationStatusEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("applicationStatus-edit-dialog-component")).toBeInTheDocument();
});
