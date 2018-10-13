import {test} from './utils'
import * as assert from 'assert'

test('getFoodById', '02003', res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body.nutrients))
})

test('getRdis', {age: 25, gender: 'M'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getFoods', {name: 'broccol'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getFoodGroups', undefined, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getNutrients', undefined, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getTopFoodsForNutrient', {nutrientId: '208'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getTopFoodsForNutrient', {nutrientId: '303'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getCurrentUser', undefined, res => {
    assert(res.status === 200)
    assert(res.body.id === 1)
})

test('getWeekMeals', {userId: 1}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})
