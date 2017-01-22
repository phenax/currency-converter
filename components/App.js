
import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Picker
} from 'react-native';


const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: '#fff',
	},

	header: {
		fontSize: 20,
		padding: 18,
		marginBottom: 20,
		backgroundColor: '#009688',
		elevation: 8,
		color: '#fff'
	},

	wrapper: {
		padding: 5,
	},

	pickerWrapper: {
		padding: 15,
		elevation: 2,
		backgroundColor: '#fff',
	},

	label: {
		fontSize: 13,
		color: '#999'
	}

});


export default class currencyConverter extends React.Component {

	constructor(props) {
		super(props);

		this.BASE_CONVERSION= 'EUR';
		this.API_URL= 'https://api.fixer.io/latest?base=EUR';

		this.state= {
			currency: 0,
			conversionRateList: [],
			outputCurrency: 0,
			input: 0
		};

		this.updateList();
	}


	updateList() {

		fetch(this.API_URL)
			.then(data => data.json())
			.then(data => data.rates)
			.then(rates => {

				const rateList= [];

				for(let key in rates)
					rateList.push({ label: key, value: rates[key] });

				return rateList;
			})
			.then(rates => this.setState({ 'conversionRateList': rates }));
	}


	getConversionResult() {

		let inputRate= this.state.conversionRateList[this.state.currency];
		inputRate= (inputRate)? inputRate.value: 1;

		let outputRate= this.state.conversionRateList[this.state.outputCurrency];
		outputRate= (outputRate)? outputRate.value: 1;

		return this.state.input * outputRate / inputRate;
	}


	render() {

		const select= i => this.state.conversionRateList[i].value;

		if(!this.state.conversionRateList[0])
			return <View><Text>Loading....</Text></View>;

		return (
			<View style={styles.container}>

				<Text style={styles.header}>Currency Converter</Text>

				<View style={styles.wrapper}>

					<View style={styles.pickerWrapper}>
						<View>
							<Text style={styles.label}>From: </Text>

							<Picker
								selectedValue={select(this.state.currency)}
								onValueChange={(_, i) => this.setState({ currency: i })}>					

								{this.state
									.conversionRateList
									.map(rate => (<Picker.Item key={rate.label} {...rate} />))}
							</Picker>
						</View>

						<View>
							<Text style={styles.label}>To: </Text>

							<Picker
								selectedValue={select(this.state.outputCurrency)}
								onValueChange={(_, i) => this.setState({ outputCurrency: i })}>					

								{this.state
									.conversionRateList
									.map(rate => (<Picker.Item key={rate.label} {...rate} />))}
							</Picker>
						</View>
					</View>

					<View>
						<TextInput placeholder='Enter the value' onChangeText={input => this.setState({ input })} />
					</View>

					<View>
						<Text>
							The text in INR is : {this.getConversionResult()}
						</Text>
					</View>

				</View>

			</View>
		);
	}
}

