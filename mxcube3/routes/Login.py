from flask import session, redirect, url_for, render_template, request, Response, jsonify
from mxcube3 import app as mxcube
import logging
import itertools

@mxcube.route("/mxcube/api/login")
def login():
    Proposal = request.args['proposal']
    password = request.args['password']
    proposal = "".join(itertools.takewhile(lambda c: not c.isdigit(), Proposal))
    prop_number = Proposal[len(proposal):]
    return jsonify(mxcube.db_connection.get_proposal(proposal, prop_number))
