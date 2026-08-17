"""
CodeBook Invisible Virtual Environment Manager (venv_manager.py)
Handles zero-config background creation, package verification, and Python binary resolution for ~/.codebook/envs/default.
"""

import os
import sys
import venv
import subprocess
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("codebook-venv-manager")

CODEBOOK_DIR = Path.home() / ".codebook"
DEFAULT_ENV_DIR = CODEBOOK_DIR / "envs" / "default"

def get_venv_python_executable(env_dir: Path = DEFAULT_ENV_DIR) -> str:
    """Returns absolute path to the Python executable inside the virtual environment."""
    if sys.platform == "win32":
        python_exe = env_dir / "Scripts" / "python.exe"
    else:
        python_exe = env_dir / "bin" / "python"
    return str(python_exe)

def get_venv_pip_executable(env_dir: Path = DEFAULT_ENV_DIR) -> str:
    """Returns absolute path to the pip executable inside the virtual environment."""
    if sys.platform == "win32":
        pip_exe = env_dir / "Scripts" / "pip.exe"
    else:
        pip_exe = env_dir / "bin" / "pip"
    return str(pip_exe)

def ensure_codebook_venv(env_dir: Path = DEFAULT_ENV_DIR) -> str:
    """
    Ensures that the CodeBook virtual environment exists.
    If missing, creates it using venv and returns the Python executable path.
    """
    python_exe = get_venv_python_executable(env_dir)
    
    if not os.path.exists(python_exe):
        logger.info(f"Creating background CodeBook virtual environment at: {env_dir}")
        os.makedirs(env_dir.parent, exist_ok=True)
        
        # Create virtual environment with pip
        builder = venv.EnvBuilder(with_pip=True)
        builder.create(env_dir)
        logger.info("CodeBook virtual environment created successfully.")

        # Ensure codebook package directory is in sys.path / site-packages or pip installed
        runner_dir = Path(__file__).parent.resolve()
        site_packages_link = env_dir / ("Lib/site-packages" if sys.platform == "win32" else f"lib/python{sys.version_info.major}.{sys.version_info.minor}/site-packages")
        pth_file = site_packages_link / "codebook_runner.pth"
        if os.path.exists(site_packages_link):
            try:
                with open(pth_file, "w", encoding="utf-8") as f:
                    f.write(f"{runner_dir}\n")
            except Exception as e:
                logger.warning(f"Could not write pth file: {e}")

    return python_exe

if __name__ == "__main__":
    exe = ensure_codebook_venv()
    print("CodeBook Virtual Environment Python Binary:", exe)
