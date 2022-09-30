<p align="center">
  <a href="https://github.com/secondlife/setup-cygwin/actions"><img alt="typescript-action status" src="https://github.com/secondlife/setup-cygwin/workflows/build-test/badge.svg"></a>
</p>

# Setup Cygwin 

This GitHub Action downloads and installs [cygwin][] so that you can use it
with your windows-based workflows.

# Usage

Basic:
```yaml
steps:
  - uses: secondlife/setup-cygwin@v1
    with:
      packages: patch,curl
```

Running a command in the cygwin shell:
```yaml
steps:
  - uses: secondlife/setup-cygwin@v1
    id: cygwin
  - name: Run cygwin command
    shell: ${{ steps.cygwin.outputs.bash }}
    run: |
      ls
      echo "Hello!"
```

For additional information about Cygwin see [https://www.cygwin.com/]()

[cygwin]: https://www.cygwin.com/ 
