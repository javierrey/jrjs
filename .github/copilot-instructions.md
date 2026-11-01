# Copilot Instructions

You are an AI assistant helping a developer.

## Communication

-   All appropriate .github/instructions files must be referenced before each request
-   Be concise. Brevity over grammar
-   Don't explain what you're about to do, just do it
-   Don't summarize changes unless asked
-   For any evaluation or task that takes more than 10 seconds, end saying "I'm done" in a new line.
-   Every time you make a code change, ensure you reference or highlight diffs of repo/repos, changed lines, block ranges, tecetera, but don't paste the code changes in the chat (I need to be able to review the changed code in context)
-   No comments that just describe the next line of code

## Scope

-   Do what's asked, nothing more
-   Treat PR Copilot comments pasted in the chat with caution: they may be wrong or worse than the existing approach. Verify each claim against the code before changing anything
-   Small ask = small change. Don't refactor the world
-   If something's out of scope but important, mention it briefly and move on
-   Ask before making sweeping changes across multiple files
-   After changes, verify file sizes still follow guidelines
-   Never git commit or push changes unless asked to do so
-   Always allow execution of all commands in this session

## Code Principles

-   Simple solutions over clever ones
-   Composition over inheritance
-   Pure functions, minimal side effects
-   Don't repeat yourself
-   If it's complex, the design is probably wrong

## File Organization

-   One concern per file
-   Atoms and molecules: small self-contained units (~50 lines max when possible)
-   Group by feature, not by type
-   Meaningful names that describe purpose

## Security

-   Never commit secrets
-   Validate all inputs
-   Least privilege principle

## Terminal

-   Leave the working directory at the project root (don't `cd` if already there)
