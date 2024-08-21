import React from "react";
import { render, screen } from "@testing-library/react";

import RefInstitutionsEditDialogComponent from "../RefInstitutionsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders refInstitutions edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <RefInstitutionsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("refInstitutions-edit-dialog-component")).toBeInTheDocument();
});
