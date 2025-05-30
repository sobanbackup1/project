from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
import pickle
import os
import time
from typing import List
from pydantic import BaseModel
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsArticle(BaseModel):
    id: str
    date: str
    category: str
    title: str
    content: str = ""

class Cancellation(BaseModel):
    date: str
    period: str
    subject: str
    instructor: str
    remarks: str = ""

SESSION_FILE = "session.pkl"
PORTAL_URL = "https://portal.do-johodai.ac.jp"

def save_cookies(driver, path):
    with open(path, "wb") as file:
        pickle.dump(driver.get_cookies(), file)

def load_cookies(driver, path, url):
    driver.get(url)
    with open(path, "rb") as file:
        cookies = pickle.load(file)
        for cookie in cookies:
            if 'sameSite' in cookie:
                del cookie['sameSite']
            driver.add_cookie(cookie)
    driver.get(url)

def is_logged_in(driver):
    try:
        driver.find_element(By.ID, "logout-button")
        return True
    except:
        return False

def login(driver):
    driver.get(PORTAL_URL)
    print("Please log in manually in the opened browser window...")
    WebDriverWait(driver, 300).until(lambda d: is_logged_in(d))
    print("Login successful!")

def setup_driver():
    CHROMEDRIVER_PATH = "/Users/sobanfarooq/Downloads/chromedriver-mac-x64/chromedriver"
    options = Options()
    # options.add_argument("--headless")  # Disable headless for manual login
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    service = Service(CHROMEDRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=options)

    if os.path.exists(SESSION_FILE):
        try:
            load_cookies(driver, SESSION_FILE, PORTAL_URL)
            if is_logged_in(driver):
                return driver
            else:
                print("Session expired. Please login again.")
        except Exception as e:
            print("Failed to load session. Logging in again.", e)

    login(driver)
    save_cookies(driver, SESSION_FILE)
    return driver

@app.get("/api/news", response_model=List[NewsArticle])
def get_news():
    driver = None
    try:
        driver = setup_driver()
        articles = []

        driver.get(PORTAL_URL)
        wait = WebDriverWait(driver, 10)
        try:
            box_warning_divs = wait.until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "box-warning"))
            )
            if len(box_warning_divs) == 0:
                return []

            news_box = box_warning_divs[0]
            table = news_box.find_element(By.TAG_NAME, "table")
            rows = table.find_elements(By.TAG_NAME, "tr")

            for idx, row in enumerate(rows):
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 3:
                    articles.append(NewsArticle(
                        id=str(idx + 1),
                        date=cells[0].text.strip(),
                        category=cells[1].text.strip(),
                        title=cells[2].text.strip(),
                        content=""
                    ))
        except TimeoutException:
            print("Timeout waiting for news elements")
            return []

    except Exception as e:
        print(f"Error fetching news: {str(e)}")
        print(traceback.format_exc())
        return []

    finally:
        if driver:
            driver.quit()

    return articles

@app.get("/api/cancellations", response_model=List[Cancellation])
def get_cancellations():
    driver = None
    try:
        driver = setup_driver()
        cancellations = []

        url = "https://portal.do-johodai.ac.jp/cancellation/soon"
        driver.get(url)

        wait = WebDriverWait(driver, 60)
        try:
            table = wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "dataTable"))
            )

            rows = table.find_elements(By.TAG_NAME, "tr")[1:]

            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 5:
                    try:
                        date = cells[0].text.strip()
                        period = cells[1].text.strip()
                        subject = cells[2].text.strip()
                        instructor = cells[3].text.strip()
                        remarks = cells[7].text.strip() if len(cells) > 7 else ""

                        if date and period and subject and instructor:
                            cancellations.append(Cancellation(
                                date=date,
                                period=period,
                                subject=subject,
                                instructor=instructor,
                                remarks=remarks
                            ))
                    except Exception as cell_error:
                        print(f"Error processing row: {str(cell_error)}")
                        continue

        except TimeoutException:
            print("Timeout waiting for cancellation table")
            return []

    except Exception as e:
        print(f"Error fetching cancellations: {str(e)}")
        print(traceback.format_exc())
        return []

    finally:
        if driver:
            driver.quit()

    return cancellations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ==========================
# ✅ CHANGELOG
# ==========================
# - Added persistent session support using cookies saved in 'session.pkl'.
# - Manual login required once; session is reused until expiration.
# - `setup_driver()` now handles session restoration and re-login.
# - No changes made to original API structure or scraping logic.
