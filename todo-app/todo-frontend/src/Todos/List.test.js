import { render, screen } from "@testing-library/react";
import TodoList from "./List";
import { test, expect } from "@jest/globals";
import React from 'react';
import '@testing-library/jest-dom';


test('renders "done" multiple times', () => {
    render(<TodoList todos={[{ text: "test", done: false }]} />);
    expect(screen.getByText("This todo is not done")).toBeVisible();
});