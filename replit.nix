{ pkgs }: {
  deps = [
    pkgs.python39
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
  ];

  env = {
    PYTHONPATH = "./backend";
  };
}
