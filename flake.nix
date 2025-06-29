{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };
  outputs = { self, flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = with pkgs; mkShell rec {
          buildInputs = [
            go
            gnumake
            sqlite
            gopls
          ];

          LD_LIBRARY_PATH = "${lib.makeLibraryPath buildInputs}";
        };

        packages.default = with pkgs; buildGoModule {
          pname = "yayarr";
          version = "2.5.1";
          src = ./.;
          excludedPackages = [ ];
          vendorHash = null;
          ldflags = [ "-s" "-w" "-X main.Version=${version}" "-X main.GitHash=none" ];
          tags = [ "sqlite_foreign_keys" "sqlite_json" ];
          builtInputs = [
            gnumake
            sqlite
          ];
        };
      });
}

