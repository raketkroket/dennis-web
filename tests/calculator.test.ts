import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimate,
  defaultCalculatorConfig as config,
  findOptionError,
  parseDecimal,
  toggleOption,
  validateCalculatorConfig,
  validateDimension,
} from '../src/lib/calculator.ts';

// The formula from the original Configurator.tsx, kept to prove the
// rewritten tiers produce exactly the same prices.
function legacyBase(roomType: 'badkamer' | 'wc', area: number) {
  return roomType === 'badkamer'
    ? area <= 5 ? 7950 : area <= 8 ? 7950 + (area - 5) * 900 : 10650 + (area - 8) * 1100
    : area <= 2 ? 3950 : 3950 + (area - 2) * 800;
}

test('base prices match the original configurator for many room sizes', () => {
  for (const roomType of ['badkamer', 'wc'] as const) {
    for (let length = 0.5; length <= 6; length += 0.35) {
      for (let width = 0.5; width <= 4; width += 0.45) {
        const result = calculateEstimate(config, { roomType, length, width, optionIds: [] });
        assert.ok(result.ok);
        assert.equal(result.estimate.total, Math.round(legacyBase(roomType, length * width)), `${roomType} ${length}×${width}`);
      }
    }
  }
});

test('options are added at their listed price', () => {
  const result = calculateEstimate(config, { roomType: 'badkamer', length: 3, width: 2, optionIds: ['spotjes', 'niche', 'geberit_duofix'] });
  assert.ok(result.ok);
  assert.equal(result.estimate.total, 7950 + 900 + 500 + 550 + 1250);
  assert.equal(result.estimate.area, 6);
});

test('Dutch and English decimals are both accepted', () => {
  assert.equal(parseDecimal('2,5'), 2.5);
  assert.equal(parseDecimal('2.5'), 2.5);
  assert.equal(parseDecimal(' 3 '), 3);
  assert.equal(parseDecimal('2,40 m'), 2.4);
  assert.equal(parseDecimal('2,5,1'), null);
  assert.equal(parseDecimal('abc'), null);
  assert.equal(validateDimension(''), 'required');
  assert.equal(validateDimension('0,3'), 'tooSmall');
  assert.equal(validateDimension('25'), 'tooLarge');
  assert.equal(validateDimension('2,75'), null);
});

test('overlapping toilet-frame options cannot be counted twice', () => {
  assert.deepEqual(findOptionError(config, 'wc', ['geberit_duofix', 'hangtoilet_systeem']), { code: 'conflictingOptions', optionId: 'hangtoilet_systeem', conflictsWith: 'geberit_duofix' });
  assert.deepEqual(findOptionError(config, 'wc', ['toiletframe_ombouwen', 'hangtoilet_systeem']), { code: 'conflictingOptions', optionId: 'hangtoilet_systeem', conflictsWith: 'toiletframe_ombouwen' });
  assert.equal(findOptionError(config, 'wc', ['geberit_duofix', 'toiletframe_ombouwen']), null);
  assert.deepEqual(toggleOption(config, ['geberit_duofix', 'toiletframe_ombouwen', 'spotjes'], 'hangtoilet_systeem'), ['spotjes', 'hangtoilet_systeem']);
  assert.deepEqual(toggleOption(config, ['hangtoilet_systeem'], 'toiletframe_ombouwen'), ['toiletframe_ombouwen']);
});

test('the server rejects unknown, duplicate and out-of-range input', () => {
  assert.deepEqual(calculateEstimate(config, { roomType: 'wc', length: 2, width: 1, optionIds: ['gratis'] }), { ok: false, error: { code: 'unknownOption', optionId: 'gratis' } });
  assert.deepEqual(calculateEstimate(config, { roomType: 'wc', length: 2, width: 1, optionIds: ['spotjes', 'spotjes'] }), { ok: false, error: { code: 'unavailableOption', optionId: 'spotjes' } });
  assert.deepEqual(calculateEstimate(config, { roomType: 'wc', length: 0.1, width: 1, optionIds: [] }), { ok: false, error: { code: 'invalidDimensions' } });
  assert.deepEqual(calculateEstimate(config, { roomType: 'keuken' as never, length: 2, width: 2, optionIds: [] }), { ok: false, error: { code: 'unknownRoom' } });
});

test('the default configuration passes the editor validation', () => {
  assert.deepEqual(validateCalculatorConfig(config), []);
  const broken = structuredClone(config);
  broken.rooms[0].tiers[0].fromArea = 4;
  broken.options[0].price = -5;
  assert.equal(validateCalculatorConfig(broken).length, 2);
});
