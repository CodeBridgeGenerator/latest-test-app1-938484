import React from "react";
import { render, screen } from "@testing-library/react";

import RefInstitutionsCreateDialogComponent from "../RefInstitutionsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders refInstitutions create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <RefInstitutionsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("refInstitutions-create-dialog-component")).toBeInTheDocument();
});
