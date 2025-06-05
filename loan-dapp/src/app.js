const contractAddress =
	'0x384c1e04a67da065e12b9d8a02de93b05f205c1e'
const abi = [
	{
		inputs: [],
		name: 'acceptLoan',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'lender',
				type: 'address',
			},
		],
		name: 'LoanAccepted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'borrower',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'totalAmount',
				type: 'uint256',
			},
		],
		name: 'LoanRepaid',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'borrower',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'interest',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'dueDate',
				type: 'uint256',
			},
		],
		name: 'LoanRequested',
		type: 'event',
	},
	{
		inputs: [],
		name: 'repayLoan',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_interestRate',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_dueDate',
				type: 'uint256',
			},
		],
		name: 'requestLoan',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'borrower',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'dueDate',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLoanDetails',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'interestRate',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'lender',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'loanAccepted',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'loanAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'repaid',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]

let provider, signer, contract

async function init() {
	if (window.ethereum) {
		provider =
			new ethers.providers.Web3Provider(
				window.ethereum
			)
		await provider.send(
			'eth_requestAccounts',
			[]
		)
		signer = provider.getSigner()
		contract = new ethers.Contract(
			contractAddress,
			abi,
			signer
		)
	} else {
		alert('Please install MetaMask')
	}
}

init()

async function requestLoan() {
	const amount =
		document.getElementById(
			'amount'
		).value
	const interest =
		document.getElementById(
			'interest'
		).value
	const due =
		document.getElementById('due').value
	const tx = await contract.requestLoan(
		ethers.utils.parseEther(amount),
		parseInt(interest),
		parseInt(due)
	)
	await tx.wait()
	alert('Loan requested!')
}

async function acceptLoan() {
	const loanAmt =
		await contract.loanAmount()
	const tx = await contract.acceptLoan({
		value: loanAmt,
	})
	await tx.wait()
	alert('Loan accepted & ETH sent!')
}

async function repayLoan() {
	const [, , loanAmount, interestRate] =
		await contract.getLoanDetails()
	const total = loanAmount.add(
		loanAmount
			.mul(interestRate)
			.div(100)
	)
	const tx = await contract.repayLoan({
		value: total,
	})
	await tx.wait()
	alert('Loan repaid!')
}
