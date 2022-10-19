//   Fetch data from json file
const fetchData = async () => {
	let { req, data } = {};
	try {
		req = await fetch("json/jsonfile.json");
		data = await req.json();
	} catch (error) {
		console.log("No data in JSON file");
		return { data: "", hasData: false };
	}
	const hasData = Object.keys(data).length !== 0;

	return { data, hasData };
};

export default fetchData;
