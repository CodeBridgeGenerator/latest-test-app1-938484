import React from "react";
import { render, screen } from "@testing-library/react";

import RefInstitutionsPage from "../RefInstitutionsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders refInstitutions page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <RefInstitutionsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("refInstitutions-datatable")).toBeInTheDocument();
    expect(screen.getByRole("refInstitutions-add-button")).toBeInTheDocument();
});
