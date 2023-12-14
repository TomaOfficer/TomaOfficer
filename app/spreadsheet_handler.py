import os
from openpyxl import load_workbook
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
client = OpenAI()

def get_monthly_income_from_openai(square_footage, renovation_type):
    try:
        prompt = f"Calculate an exact dollar figure for the estimated monthly income for a {square_footage} square foot {renovation_type}."

        response = client.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
          ]
        )

        return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error: {e}")
        return "Error in generating monthly income"

def get_todays_date():
    return datetime.today().strftime('%Y-%m-%d')

def calculate_rehab_cost(square_footage, renovation_amount):
    rehab_quote = {'minimal': 250, 'moderate': 300, 'total': 450}
    return square_footage * rehab_quote.get(renovation_amount, 0)

def calculate_cost_for_loan(mortgage_amount):
    return 0.01 * mortgage_amount

def calculate_closing_cost(acquisition_price):
    return 0.02 * acquisition_price

def calculate_total_upfront_cost(upfront_cost, rehab_cost):
    return upfront_cost + rehab_cost

def calculate_percentage_of_value(value, percentage):
    return value * (percentage / 100.0)

# Define the structure of DataFrame
columns = [
    'Property address', 'Last update', 'Upfront cost', 'Cashflow monthly', 'Cashflow annually', 
    'Cap rate', 'Estimated value after 20 years', 'Acquisition price', 'Down payment',
    'Rehab cost', 'Inspection fees and upfront cost', 'Transfer tax', 
    'Cost for loan', 'Closing cost', 'Total upfront cost', 'Mortgage amount', 'Mortgage repayment period', 
    'Mortgage interest rate', 'Mortgage monthly cost', 'Property taxes', 'Home insurance', 'Repairs and maintenance', 
    'Vacancy', 'Capital expenditures', 'Management fees', 'HOA fees', 'Electricity', 'Gas', 'Water / sewer',
    'Garbage', 'Other monthly costs', 'Total monthly cost'
]

def initialize_dataframe():
  return pd.DataFrame(columns=columns)

def add_property_to_dataframe(df, property_data):
    # rehab_cost = calculate_rehab_cost(property_data['squareFootage'], property_data['renovationAmount'])
    # closing_cost = calculate_closing_cost(property_data['acquisitionCost'])
    # total_upfront_cost = calculate_total_upfront_cost(property_data['upfrontCost'], rehab_cost)
    # total_monthly_income = property_data['totalMonthlyIncome']
    # repairs_and_maintenance = calculate_percentage_of_value(total_monthly_income, 10)
    # vacancy = calculate_percentage_of_value(total_monthly_income, 5)
    # capex = calculate_percentage_of_value(total_monthly_income, 10)
    # mgt_fees = calculate_percentage_of_value(total_monthly_income, 8)

    final_property_data = {
        'Property address': '',
        'Last update': get_todays_date(),
        'Upfront cost': '',
        'Cashflow monthly': '',
        'Cashflow annually': '',
        'Cap rate': '',
        'Estimated value after 20 years': '',
        'Acquisition price': property_data['acquisitionCost'],
        'Down payment': '',
        'Rehab cost': '',
        'Downpayment + rehab cost': '', 
        'Inspection fees and upfront cost': '',
        'Transfer tax': '', 
        'Cost for loan': '',
        'Closing cost': '',
        'Total upfront cost': '',
        'Mortgage amount': '',
        'Mortgage repayment period': '',
        'Mortgage interest rate': '',
        'Mortgage monthly cost': '',
        'Property taxes': '',
        'Home insurance': '',
        'Repairs and maintenance': '',
        'Vacancy': '',
        'Capital expenditures': '',
        'Management fees': '',
        'HOA fees': '',
        'Electricity': '',
        'Gas': '',
        'Water / sewer': '',
        'Garbage': '',
        'Other monthly costs': '',
        'Total monthly cost': '',
    }

    if not isinstance(df, pd.DataFrame):
        print("Error: df is not a DataFrame.")
        return df

    try:
        df = df.append(final_property_data, ignore_index=True)
    except AttributeError as e:
        print(f"AttributeError: {e}")
        # This is a backup plan in case append fails for some reason
        new_row = pd.DataFrame([final_property_data], columns=df.columns)
        df = pd.concat([df, new_row], ignore_index=True)

    return df