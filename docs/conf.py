"""Configuration file for the Sphinx documentation builder."""
import os
import subprocess

# The actual documentation is generated by doxygen and output to "build/html"
# sphinx generates separate documentation from index.rst and outputs that to "_build/html".
# Use sphinx's html_extra_path option to overwrite the dummy sphinx documentation with
# doxygen's html output.
html_extra_path = ["build/html"]  # relative to the docs folder

print("Using Doxygen version", end=" ")
subprocess.run(["doxygen", "--version"], check=True)

# To build this repo's docs when the theme's css and js files are already built & minified
# (ie using release assets).
# subprocess.call("cd .. && doxygen docs/Doxyfile", shell=True)

# for this repo we need to use npm to build the css & js files from the theme's src

# first install theme's dev dependencies
if not os.path.exists("../node_modules"):
    print("Theme dependencies not present. Running `npm install`")
    subprocess.run(["npm", "install", ".."], check=True, shell=True)

# now run the package script called "doxygen"
subprocess.run(["npm", "run", "doxygen"], check=True, shell=True)
