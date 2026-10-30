# AliTV

[![AI-assisted](https://img.shields.io/badge/AI--assisted-since%20v2.0.0-orange.svg)](#ai-assistance)
[![Last release without AI](https://img.shields.io/badge/last%20release%20without%20AI-v1.0.7-blue.svg)](https://github.com/AliTVTeam/AliTV/releases/tag/v1.0.7)

> [!WARNING]
> **AI-assisted development since version 2.0.0**
>
> Starting with version 2.0.0, we use AI tools to help maintain AliTV.
> Right now we do not have the time to keep AliTV up to date actively without AI support.
>
> - **What AI does at the moment:** it mainly helps us keep all dependencies up to date.
> - **What may come:** we do not rule out AI-assisted feature development in the future.
> - **Our promise:** we report openly what was done with AI support.
>   Every commit says what AI was used for, and every release lists the AI-assisted changes in the [changelog](#changelog).
>
> The last version developed without AI support is [v1.0.7](https://github.com/AliTVTeam/AliTV/releases/tag/v1.0.7).

## AI assistance

Since version 2.0.0, AliTV is maintained with the help of AI tools.
The maintainers review every AI-assisted change before it is merged.
Each AI-assisted commit has a trailer that names the AI tool and says what it did, for example:

```
AI-Assisted: Claude Code drafted the dependency updates
```

If you prefer a version without any AI involvement, use [v1.0.7](https://github.com/AliTVTeam/AliTV/releases/tag/v1.0.7).

## Tutorial

Read the documentation at [readthedocs](http://alitv.readthedocs.io/en/latest/index.html).

## Dependencies

- A web browser
- For the perl part, see [AliTV-perl-interface](https://github.com/AliTVTeam/AliTV-perl-interface)

## Installation

You do not need to install anything to try the interactive visualization of AliTV.
Just navigate to the [demo](https://alitvteam.github.io/AliTV/d3/AliTV.html) page to try all the features on an example dataset (seven chloroplast genomes).
You can also import your own json files on that page.
When loading your own data into AliTV it is not transferred to a server but remains on your local machine.

If you want to generate the json file for your genomes you can use the command line script alitv.pl as follows:

git clone –recursive <https://github.com/AliTVTeam/AliTV>

## Usage

AliTV.pl can be called directly on your input files or in advanced mode supplying a yaml configuration file.
The output is a json object as required by the visualization part of AliTV (see [details](https://alitvteam.github.io/AliTV/d3/doc/AliTV.html)) in the file \<project\>.json (project can be set via command line parameter, otherwise a random name is generated). For more details about `alitv.pl` please see [the documentation](https://github.com/AliTVTeam/AliTV-perl-interface/blob/master/doc/alitv.md).

Simple mode: Just supply your files and redirect to json file
cd AliTV-perl-interface
perl bin/alitv.pl –project simple data/chloroset/\*.fasta

Advanced mode: Supply a config yaml file
cd AliTV-perl-interface
perl bin/alitv.pl –project advanced data/chloroset/input.yml

## Input

Input for the simple mode should be in one of the [Bioperl supported formats](http://bioperl.org/howtos/SeqIO_HOWTO.html#item5) (currently 42 different).
Annotation files can be supplied in tsv format (have to be specified in the yml file, [example file for ndh genes](https://github.com/AliTVTeam/AliTV-perl-interface/blob/master/data/chloroset/ndh.tsv)).
Documentation for the yaml file is soon to be added for now consult this [example file](https://github.com/AliTVTeam/AliTV-perl-interface/blob/master/data/chloroset/input.yml) for usage information.

## Output

By default, AliTV generates a configuration file (yaml format) if none is supplied, a log file and a json string on standard out.
The json can then be visualized with AliTV on the [demo](https://alitvteam.github.io/AliTV/d3/AliTV.html) page or locally in [d3/AliTV.html](d3/AliTV.html).
The format of the json file is specified in the [source documentation](https://alitvteam.github.io/AliTV/d3/doc/AliTV.html) relevant members are "conf", "data", and "filters".

## Homepage

For further information visit the [homepage](http://alitvteam.github.io/AliTV).

## Citing AliTV

An article about AliTV has been published in [PeerJ Computer Science](https://peerj.com/articles/cs-116/) [![DOI](https://img.shields.io/badge/DOI-10.7717%2Fpeerj--cs.116-blue.svg)](https://peerj.com/articles/cs-116/)
Please cite this article if you use AliTV in your project.
Additionally the software in any specific version can be cited via its zenodo doi, latest:
[![Zenodo DOI](https://zenodo.org/badge/12731/AliTVTeam/AliTV.svg)](https://zenodo.org/badge/latestdoi/12731/AliTVTeam/AliTV)

Please also cite:

- lastz
- bioperl

## Contact

If you have any questions or encounter problems or potential bugs, don't
hesitate to contact us. Either report [issues](https://github.com/AliTVTeam/AliTV/issues) on github or write an email to:

- Markus Ankenbrand - markus.ankenbrand@uni-wuerzburg.de

## License

[![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/AliTVTeam/AliTV/blob/master/LICENSE)

AliTV itself is available under MIT license.
The licenses of included libraries might differ, please see [LICENSES/README.org](LICENSES/README.org) for details.

## Build

[![Build Status](https://travis-ci.org/AliTVTeam/AliTV.svg?branch=master)](https://travis-ci.org/AliTVTeam/AliTV/)
[![Coverage Status](https://coveralls.io/repos/github/AliTVTeam/AliTV/badge.svg?branch=master)](https://coveralls.io/github/AliTVTeam/AliTV?branch=master)

## Repo Status

[![Project Status: Inactive](https://www.repostatus.org/badges/latest/inactive.svg)](https://www.repostatus.org/#inactive)
Inactive – The project has reached a stable, usable state but is no longer being actively developed; support/maintenance will be provided as time allows.

## Changelog

### 2.0.0 \<unreleased\>

- Add notice on AI-assisted maintenance (AI-assisted: drafted with Claude Code)
- Convert README from Org mode to Markdown (AI-assisted: converted with Claude Code)

### 1.0.7 \<2024-09-24\>

- Fix karyo shift error with big number of genomes
- Fix link length filter (#146)
- Add CITATION.cff
- Add repo status badge

### 1.0.6 \<2018-06-08\>

- Update AliTV-perl-interface to v1.0.6

### 1.0.5 \<2018-05-15\>

- Add experimental auto-ordering
- Fix context menu bug

### 1.0.4 \<2018-01-05\>

- Use karyo names rather than ids in web interface
- Add google analytics to collect usage stats (with opt-out possibility)

### 1.0.3 \<2017-06-16\>

- Fix split feature bug (#131)
- Add citation info

### 1.0.2 \<2017-04-25\>

- Add documentation of perl part (rtd)
- Add demo sets bacteria, chromosomes
- Fix svg namespace (#116)
- Remove genome color gradient from chloro demo
- Include perl part version 1.0.2

### 1.0.1 \<2017-04-20 Do\>

- Include perl part version 1.0.1

### 1.0.0 \<2017-04-13 Do\>

- Include perl part version 1.0.0

### 0.4.1 \<2016-08-05 Fr\>

- Fix corner cases for move chromosome left/right
- Fix corner cases for move genome up/down
- Add linkOpacity setting (#104)
- Remove circular from headline (#102)
- Fix special characters in id bug (#108)
- Add feature labels
- Update perl part to version 0.1.7

### 0.4.0 \<2016-06-18 Sa\>

- Include new perl interface
- Update documentation

### 0.3.9 \<2016-06-09 Do\>

- Move to AliTVTeam organization

### 0.3.8 \<2016-06-06 Mo\>

- Update bootstrap-select to version 1.10.0
- Update colorpicker to version 2.3.2
- Update bootstrap to version 3.3.6
- Update jQuery-UI to version 1.11.4
- Update jQuery to version 2.2.4
- Update d3.js to version 3.5.17

### 0.3.7 \<2016-06-02 Do\>

- Improve general layout and style
- Improve tab structure of Advanced Settings (#89)
- Fix getter/setter for shifting chromosomes (#91)
- Display name and genome of a seq (#96)

### 0.3.6 \<2015-11-02 Mo\>

- Highlight active slider range (#84)
- Update slider range (#85)
- Fix feature hiding bug (#87)
- Fix tree drawing bug (#88)

### 0.3.5 \<2015-09-24 Do\>

- Add version number to html page
- Auto adjust tree representation when reordering genomes
- Warn if tree is not concordant with genome order
- Legend for biological feature types
- Color scale for link identity

### 0.3.4 \<2015-09-16 Mi\>

- Add custom features via the interface

### 0.3.3 \<2015-09-11 Fr\>

- Bug fix in template

### 0.3.2 \<2015-09-11 Fr\>

- rotation of circular sequences
- dynamic (biological) feature menus
- code cleanup

### 0.3.1 \<2015-08-13 Do\>

- Strand specific features
- Reset for genome zooming
- Libraries for contextMenu are update with generateJSONFiles.pl
- Fix \#52: allow hiding of features with non-unique names
- Add new alerts and error messages

### 0.3 \<2015-07-31 Fr\>

- Show selected genome regions (independent)
- Horizontal scroll bar
- Add complete tab structure for the interface
- Add context menus for chromosomes, features and links
- Allow reordering of genomes and chromosomes by using the context menus
- Allow specific hiding of features, links and chromosomes

### 0.2.1 \<2015-07-16 Do\>

- Added MIT License
- Included License information for third party libraries

### 0.2.0 \<2015-07-16 Do\>

- allow for input as tsv and bed files as alternative to fasta files
- demo data added - seven chloroplast genomes
- documentation added
- test cases added
- added interactive JavaScript output
- renamed to Alignment Toolbox and Visualization (AliTV)

### 0.1.0 \<2015-01-31 Sa\>

- First release of the wgaPipeline code.
- Automated whole genome alignment and circos visualization from two fasta files.
