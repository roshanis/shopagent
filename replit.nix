{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.nodejs
    pkgs.nodePackages.npm
  ];

  env = {
    PYTHONPATH = "./backend";
  };
}
