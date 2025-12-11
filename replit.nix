{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.websockets
    pkgs.python311Packages.aiofiles
    pkgs.python311Packages.pytest
    pkgs.python311Packages.black
    pkgs.python311Packages.flake8
  ];
}
