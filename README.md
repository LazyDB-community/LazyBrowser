<br/>
<p align="center">
  <a href="https://github.com/LazyDB-community/LazyBrowser">
    <img src="https://i.imgur.com/oTW6Hab.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">LazyBrowser</h3>

  <p align="center">
    Use LazyDB in your browser using JavaScript!
    <br/>
    <br/>
    <a href="https://github.com/LazyDB-community/LazyBrowser"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/LazyDB-community/LazyBrowser">View Demo</a>
    .
    <a href="https://github.com/LazyDB-community/LazyBrowser/issues">Report Bug</a>
    .
    <a href="https://github.com/LazyDB-community/LazyBrowser/issues">Request Feature</a>
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/LazyDB-community/LazyBrowser/total) ![Contributors](https://img.shields.io/github/contributors/LazyDB-community/LazyBrowser?color=dark-green) ![Forks](https://img.shields.io/github/forks/LazyDB-community/LazyBrowser?style=social) ![Stargazers](https://img.shields.io/github/stars/LazyDB-community/LazyBrowser?style=social) ![Issues](https://img.shields.io/github/issues/LazyDB-community/LazyBrowser) ![License](https://img.shields.io/github/license/LazyDB-community/LazyBrowser) 

## Table Of Contents

* [Requirements](#requirements)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## Requirements

* A working LazyDB server, that you can get on https://lazydb.com    
* The JS connector, that you can find here, or using a cdn : https://lazybrowser.lazydb.com/lazydb.js   

## Getting Started

Using LazyDB in JS is really easy, you only need to create a Database object!

```js
const db = new Database("youtproject.lazydb.com", 42600);
```

Once you initialized the database, you can use any command, here is an example of the login command :

```js
db.connect("email", "password").then((userData) => {
  console.log(userData.username + " is now connected!");
}).catch(console.log);
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/LazyDB-community/LazyCSharp/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.
* Please also read through the [Code Of Conduct](https://github.com/LazyDB-community/LazyCSharp/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/LazyDB-community/LazyBrowser/blob/main/LICENSE.md) for more information.

## Authors

* **Vic92548** - *CTO* - [Vic92548](https://github.com/Vic92548) - *Part of the library*
* **Sharkou** - *Friend* - [Sharkou](https://github.com/Sharkou) - *Part of the library*
* **MoskalykA** - *Developer* - [MoskalykA](https://github.com/MoskalykA/) - *Part of the library*
