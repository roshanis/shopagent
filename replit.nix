{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.python3Packages.virtualenv
    pkgs.nodejs
    pkgs.nodePackages.npm
  ];

  env = {
    PYTHONPATH = "./backend";
    VIRTUAL_ENV = ".venv";
  };
}
