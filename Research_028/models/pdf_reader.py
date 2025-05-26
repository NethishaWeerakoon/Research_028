from PyPDF2 import PdfReader
from typing import NamedTuple
from collections import namedtuple


def pdf_text_extractor(pdf_file_path:str )->NamedTuple:
    PDF2TXT = namedtuple('PDF2TXT' , ['page_content'])
    reader = PdfReader(pdf_file_path)
    page_content = []
    number_of_pages = len(reader.pages)
    for i in range(number_of_pages):
        page = reader.pages[i]
        text = page.extract_text()
        page_content.append({
            "page_number":i,
            "content" : text
        })
    pdftext =  PDF2TXT(page_content=page_content)
    return pdftext 