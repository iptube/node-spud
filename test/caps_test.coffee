expect = require('chai').expect
caps = require '../lib/caps'

HASH = new Buffer '856b949dac0629688edaf9aede3873a1f42b3042ec8632706c658428766045b0', 'hex'
describe 'capabilities', ->
  it 'can be calculated', ->
    c = caps.hash [
      'a'
      'b'
      'c'
      0
    ]
    expect(c).to.be.instanceof Buffer
    expect(c).to.deep.equal HASH
  it 'checks for dups', ->
    c = caps.hash [
      0
      0
    ]
    expect(c).to.be.null
    c = caps.hash [
      'a'
      'a'
    ]
    expect(c).to.be.null
  it 'rejects non-string, non-int', ->
    c = caps.hash [
      1.4
    ]
    expect(c).to.be.null
    c = caps.hash [
      {}
    ]
    expect(c).to.be.null
    c = caps.hash [
      ''
    ]
    expect(c).to.be.null
  it 'caches', ->
    a = caps.get HASH
    expect(a).to.deep.equal [
      0
      'a'
      'b'
      'c'
    ]
    a = caps.get 'ffff'
    expect(a).to.be.undefined
  it 'checks', ->
    c = caps.check [
      'c'
      'd'
    ], new Buffer('00')
    expect(c).to.be.false
    c = caps.check [
      'c'
      'd'
    ], new Buffer('684b1dfd39c76920e794a87260d824627f62a69b56061a436ed4a56e09eac35a', 'hex')
    expect(c).to.be.true
    c = caps.check [
      1.2
    ], new Buffer('00')
    expect(c).to.be.false
