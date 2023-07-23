# Obsidian Sugar

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22sugar%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
<a name="readme-top"></a>[![contributors](https://img.shields.io/github/contributors/conneroisu/obsidian-oil.svg?style=for-the-badge)](https://github.com/conneroisu/obsidian-oil/graphs/contributors)[![forks](https://img.shields.io/github/forks/conneroisu/obsidian-oil.svg?style=for-the-badge)](https://github.com/conneroisu/obsidian-oil/network/members)[![stargazers](https://img.shields.io/github/stars/conneroisu/obsidian-oil.svg?style=for-the-badge)](https://github.com/conneroisu/obsidian-oil/stargazers)[![license](https://img.shields.io/github/license/conneroisu/obsidian-oil.svg?style=for-the-badge)](https://github.com/conneroisu/obsidian-oil/blob/master/LICENSE)[![issues](https://img.shields.io/github/issues/conneroisu/obsidian-oil.svg?style=for-the-badge)](https://github.com/conneroisu/obsidian-oil/issues)

<div align="center"> <img src="assets/obsidianoilogo.jpg" alt="Logo" width="80" height="80"> <h3 align="center">Auto-GPT-Obsidian</h3> <p align="center"> A <a href="https://github.com/tpope/vim-vinegar">vim-vinegar</a> or <a href="https://github.com/stevearc/oil.nvim">oil</a> like file explorer that lets you edit your filesystem like a normal Vim buffer in Obsidian. </p> </div>

<details><summary>Table of Contents</summary><ol>
    <li><a href="#details">Details</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#use-cases">Use Cases</a> </li>
    <li><a href="#commands">Commands</a></li>
    <li><a href="#contribution">Contribution</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
</ol></details>

# Introduction

The goals of this plugin are to provide full control over the file system within your vault using a note as an interaction surface. Notes created with this plugin are hidden from searches within your vault to allow for a faultless adoption.

# Warning of Use

This plugin uses a specially hidden directory and files so that the sugar can house and hide the files the user interacts with. Upon initialization, the files within the sugar directory are deleted to allow for new, updated versions of those files to be created. This plugin is not responsible for the side effects that may incur due to the adoption and use of it's self.

# Details

Wanting to use the leader key to trigger commands for the plugin? I recommend [tgrosinger's leader-hotkeys-obsidian](https://github.com/tgrosinger/leader-hotkeys-obsidian).
Wanting to use `g<C-a>`? I would recommend using an [specific increment map]() within your `.obsidian.vimrc`

# Features

-   [ ] Edit your filesystem like a buffer (allows for creating, renaming, deleting, and moving)
-   [ ] Renaming of files hooks into actions inside of Obsidian so that plugins can readjust the links to and from a file.
-   [ ] Cross-Directory Actions within buffer

# Contribution

Conner Ohnesorge
[funding](https://ko-fi.com/connero)

# FAQ

Q: Why "sugar"?

From [oil](https://github.com/stevearc/oil.nvim)&[vinegar ](https://github.com/tpope/vim-vinegar) readme:
Split windows and the project drawer go together like oil and vinegar. I don't mean to say that you can combine them to create a delicious salad dressing. I mean that they don't mix well!

Drew Neil
Vinegar was [[taken]](https://github.com/tpope/vim-vinegar). So was oil. However neither are as needed in a recipe as sugar. Plus, I think it's pretty sweet ;)

# Acknowledgements

https://github.com/zapthedingbat/drawio-obsidian/tree/4dd1d0a75115e0c50419e92ec65f226849100941

<p align="right">(<a href="#readme-top">back to top</a>)</p>
