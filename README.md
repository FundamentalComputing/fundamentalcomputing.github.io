# Compilation instructions (for Mac OS)

Install `chruby` and `ruby-install` from Homebrew for proper management of Ruby versions:

```
brew install chruby ruby-install 
```

Then use `ruby-install` to fetch and install the latest stable Ruby:

```
ruby-install ruby-3
```

Then use `chruby` to select Ruby 3 as the current version and check that it works properly:

```
chruby ruby-3
ruby --version
```

Then simply run `bundle install` and `bundle exec jekyll serve` to
grab the dependencies and build & serve the website.
