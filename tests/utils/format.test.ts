import {
	toDDHHMMSS,
	
} from '../../src/utils/format';

describe('Format', () => {
	describe('toDDHHMMSS - Phase Test 1', () => {
		it('should return the correct time for Test 00:00:00:01', () => {
			const expected = "00:00:00:01";
      const resp = toDDHHMMSS(1);
			expect(resp).toEqual(expected);
		});
		it('should return the correct time for Test 00:00:01:01', () => {
			const expected = "00:00:01:01";
			const resp = toDDHHMMSS(61);
			expect(resp).toEqual(expected);
		});
		it('should return the correct time for Test 00:01:01:01', () => {
			const expected = "00:01:01:01";
			const resp = toDDHHMMSS(3661);
			expect(resp).toEqual(expected);
		});
		it('should return the correct time for Test 01:01:01:01', () => {
			const expected = "01:00:00:00";
			const resp = toDDHHMMSS(86400);
			expect(resp).toEqual(expected);
		});
		it('should return the correct time for Test 01:01:01:01', () => {
			const expected = "01:01:01:06";
			const resp = toDDHHMMSS(90066);
			expect(resp).toEqual(expected);
		});
		it('should return the correct time for Test 00:00:00:00', () => {
      const expected = "00:00:00:00";
      const resp = toDDHHMMSS(0);
			expect(resp).toEqual(expected);
		});
	});
});
