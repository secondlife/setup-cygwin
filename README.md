<p align="center">
  <a href="https://github.com/secondlife/setup-cygwin/actions"><img alt="typescript-action status" src="https://github.com/secondlife/setup-cygwin/workflows/build-test/badge.svg"></a>
</p>

# Setup Cygwin 

This GitHub Action downloads and installs [cygwin][] so that you can use it
with your workflows.

# Usage

Basic:

```yaml
steps:
  - uses: secondlife/setup-cygwin@v1
    with:
      packages: bash,curl
```

For additional information about Cygwin see [https://www.cygwin.com/]()

[cygwin]: https://www.cygwin.com/ 
