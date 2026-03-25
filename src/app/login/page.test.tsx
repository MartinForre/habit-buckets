import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import LoginPage from "@/app/login/page"

describe("Login page", () => {
  it("renders sign in form", async () => {
    const page = await LoginPage({
      searchParams: Promise.resolve({}),
    })

    render(page)

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
  })
})
