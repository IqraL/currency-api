# Iqra_Latif_Vestiaire_Test

## instuctions for setup

1. npm i
2. npm run start or npm run dev
3. upload items to localhost:5000/ (POST request) sample data is provided in sample-test-data-postman.json in root directory of project
4. to get payput generated use the GET request localhost:5000/payouts?numberOfPayouts=10
   "numberOfPayouts" query gets the last saved payouts in the db in this example you would get the last 10 saved payouts in the db
5. you can change the MAX_PAYOUT_AMOUNT for a payout , its in the constant file in src
