module.exports = {
	rules: {
		'header-max-length': [2, 'always', 120], // 要求内容长度<=120
		'type-case': [2, 'always', 'upper-case'], // 要求type必须是大写
		'type-empty': [2, 'never'],  // 要有type后必须有一个空格
		'type-enum': [
			2,
			'always',
			[
				'RELEASE',
				'CHORE',
				'CI',
				'DOCS',
				'FEAT',
				'FIX',
				'PERF',
				'REFACTOR',
				'REVERT',
				'STYLE',
				'TEST',
			],
		],
	}
};