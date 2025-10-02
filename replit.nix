{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.nodejs
    pkgs.nodePackages.npm
  ];

  env = {
    PYTHONPATH = "./backend";
    PYTHONUSERBASE = "$HOME/.local";
  };
}
