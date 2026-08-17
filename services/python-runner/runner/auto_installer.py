"""
CodeBook Automatic Missing Module Detector & Package Installer (auto_installer.py)
Parses ModuleNotFoundError tracebacks, resolves PyPI package aliases, and installs missing packages into ~/.codebook/envs/default.
"""

import re
import subprocess
import logging
from typing import Optional
try:
    from .venv_manager import get_venv_pip_executable
except ImportError:
    from venv_manager import get_venv_pip_executable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("codebook-auto-installer")

# PyPI package import aliases mapping
PACKAGE_IMPORT_MAP = {
    "cv2": "opencv-python-headless",
    "mediapipe": "mediapipe",
    "PIL": "Pillow",
    "bs4": "beautifulsoup4",
    "sklearn": "scikit-learn",
    "yaml": "PyYAML",
    "attr": "attrs",
    "dateutil": "python-dateutil",
    "docx": "python-docx",
    "pptx": "python-pptx",
    "fitz": "PyMuPDF",
    "openpyxl": "openpyxl",
    "xlsxwriter": "XlsxWriter",
    "serial": "pyserial",
    "usb": "pyusb",
    "crypto": "pycryptodome",
    "jwt": "PyJWT",
    "dotenv": "python-dotenv",
    "google.protobuf": "protobuf",
}

def extract_missing_module(stderr_text: str) -> Optional[str]:
    """Extracts the missing module name from a ModuleNotFoundError stderr traceback."""
    if not stderr_text:
        return None
    match = re.search(r"ModuleNotFoundError:\s+No\s+module\s+named\s+['\"]([a-zA-Z0-9_\-\.]+)['\"]", stderr_text)
    if match:
        raw_module = match.group(1).split(".")[0]
        return raw_module
    return None

def install_missing_package(module_name: str) -> bool:
    """Installs the PyPI package corresponding to the missing module name into CodeBook's venv."""
    package_name = PACKAGE_IMPORT_MAP.get(module_name, module_name)
    pip_exe = get_venv_pip_executable()

    logger.info(f"Auto-installing missing package '{package_name}' via pip into CodeBook venv...")
    try:
        res = subprocess.run(
            [pip_exe, "install", package_name],
            capture_output=True,
            text=True,
            timeout=120
        )
        if res.returncode == 0:
            logger.info(f"Successfully auto-installed package '{package_name}'.")
            return True
        else:
            logger.warning(f"Failed to auto-install package '{package_name}': {res.stderr}")
            return False
    except Exception as e:
        logger.error(f"Error during auto-install of '{package_name}': {str(e)}")
        return False
